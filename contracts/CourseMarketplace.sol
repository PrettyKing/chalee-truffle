// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./CHMToken.sol";

contract CourseMarketplace {
    CHMToken public chmToken;
    address public owner;
    uint256 public courseCounter;
    uint256 public platformFeePercent = 5; // 5%平台手续费
    bool public paused = false;

    struct Course {
        uint256 id;
        string title;
        string description;
        string contentHash; // IPFS内容哈希
        uint256 price; // CHM代币价格
        address instructor;
        bool isActive;
        uint256 studentsCount;
        uint256 createdAt;
        string thumbnailHash; // 课程缩略图IPFS哈希
        uint256 duration; // 课程时长（分钟）
    }

    struct Purchase {
        uint256 courseId;
        address student;
        uint256 timestamp;
    }

    mapping(uint256 => Course) public courses;
    mapping(address => mapping(uint256 => bool)) public hasPurchased;
    mapping(address => Purchase[]) public userPurchases;
    mapping(uint256 => Purchase[]) public coursePurchases;
    mapping(address => uint256) public instructorEarnings; // 讲师收益

    event CourseCreated(
        uint256 indexed courseId,
        string title,
        uint256 price,
        address indexed instructor
    );
    event CoursePurchased(
        uint256 indexed courseId,
        address indexed student,
        uint256 price
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyInstructor(uint256 _courseId) {
        require(courses[_courseId].instructor == msg.sender, "Not instructor");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Paused");
        _;
    }

    constructor(address _chmTokenAddress) {
        chmToken = CHMToken(_chmTokenAddress);
        owner = msg.sender;
    }

    // 创建课程
    function createCourse(
        string memory _title,
        string memory _description,
        string memory _contentHash,
        uint256 _price,
        string memory _thumbnailHash,
        uint256 _duration
    ) external whenNotPaused {
        require(_price > 0, "Invalid price");
        require(bytes(_title).length > 0, "Empty title");
        require(_duration > 0, "Invalid duration");

        courseCounter++;

        courses[courseCounter] = Course({
            id: courseCounter,
            title: _title,
            description: _description,
            contentHash: _contentHash,
            price: _price,
            instructor: msg.sender,
            isActive: true,
            studentsCount: 0,
            createdAt: block.timestamp,
            thumbnailHash: _thumbnailHash,
            duration: _duration
        });

        emit CourseCreated(courseCounter, _title, _price, msg.sender);
    }

    // 购买课程
    function purchaseCourse(uint256 _courseId) external whenNotPaused {
        Course storage course = courses[_courseId];
        require(course.isActive, "Course inactive");
        require(_courseId > 0 && _courseId <= courseCounter, "Invalid ID");
        require(!hasPurchased[msg.sender][_courseId], "Already purchased");
        require(
            chmToken.balanceOf(msg.sender) >= course.price,
            "Insufficient balance"
        );
        require(msg.sender != course.instructor, "Cannot buy own course");

        // 计算费用分配
        uint256 platformFee = (course.price * platformFeePercent) / 100;
        uint256 instructorPayment = course.price - platformFee;

        // 转账
        chmToken.transferFrom(msg.sender, course.instructor, instructorPayment);
        chmToken.transferFrom(msg.sender, address(this), platformFee);

        // 记录购买
        hasPurchased[msg.sender][_courseId] = true;

        Purchase memory newPurchase = Purchase({
            courseId: _courseId,
            student: msg.sender,
            timestamp: block.timestamp
        });

        userPurchases[msg.sender].push(newPurchase);
        coursePurchases[_courseId].push(newPurchase);

        course.studentsCount++;
        instructorEarnings[course.instructor] += instructorPayment;

        emit CoursePurchased(_courseId, msg.sender, course.price);
    }

    // 更新课程状态（仅讲师）
    function updateCourseStatus(
        uint256 _courseId,
        bool _isActive
    ) external onlyInstructor(_courseId) whenNotPaused {
        courses[_courseId].isActive = _isActive;
    }

    // 更新课程价格（仅讲师）
    function updateCoursePrice(
        uint256 _courseId,
        uint256 _newPrice
    ) external onlyInstructor(_courseId) whenNotPaused {
        require(_newPrice > 0, "Invalid price");
        courses[_courseId].price = _newPrice;
    }

    // 获取活跃课程（分页）
    function getActiveCourses(
        uint256 _offset,
        uint256 _limit
    ) external view returns (Course[] memory) {
        require(_limit > 0 && _limit <= 50, "Invalid limit");

        uint256 activeCount = 0;
        uint256 collected = 0;

        // 计算活跃课程数量
        for (uint256 i = 1; i <= courseCounter; i++) {
            if (courses[i].isActive) activeCount++;
        }

        uint256 resultSize = _limit;
        if (_offset >= activeCount) return new Course[](0);
        if (_offset + _limit > activeCount) resultSize = activeCount - _offset;

        Course[] memory result = new Course[](resultSize);
        uint256 currentActive = 0;

        for (uint256 i = 1; i <= courseCounter && collected < resultSize; i++) {
            if (courses[i].isActive) {
                if (currentActive >= _offset) {
                    result[collected] = courses[i];
                    collected++;
                }
                currentActive++;
            }
        }

        return result;
    }

    // 获取用户购买记录
    function getUserPurchases(
        address _user
    ) external view returns (Purchase[] memory) {
        return userPurchases[_user];
    }

    // 获取课程购买记录
    function getCoursePurchases(
        uint256 _courseId
    ) external view returns (Purchase[] memory) {
        return coursePurchases[_courseId];
    }

    // 获取平台统计
    function getPlatformStats()
        external
        view
        returns (
            uint256 totalCourses,
            uint256 activeCourses,
            uint256 totalPurchases
        )
    {
        uint256 active = 0;
        uint256 purchases = 0;

        for (uint256 i = 1; i <= courseCounter; i++) {
            if (courses[i].isActive) active++;
            purchases += courses[i].studentsCount;
        }

        return (courseCounter, active, purchases);
    }

    // 管理员功能
    function updatePlatformFee(uint256 _newFeePercent) external onlyOwner {
        require(_newFeePercent <= 10, "Fee too high");
        platformFeePercent = _newFeePercent;
    }

    function withdrawPlatformFees() external onlyOwner {
        uint256 balance = chmToken.balanceOf(address(this));
        require(balance > 0, "No fees");
        chmToken.transfer(owner, balance);
    }

    function pause() external onlyOwner {
        paused = true;
    }

    function unpause() external onlyOwner {
        paused = false;
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid address");
        owner = _newOwner;
    }

    // 查询函数
    function getPlatformFeesBalance() external view returns (uint256) {
        return chmToken.balanceOf(address(this));
    }

    function getInstructorEarnings(
        address _instructor
    ) external view returns (uint256) {
        return instructorEarnings[_instructor];
    }
}
