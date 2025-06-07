// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./CHMToken.sol";
// ================================
// 3. 课程市场合约
// ================================
contract CourseMarketplace {
    CHMToken public chmToken;
    address public owner;
    uint256 public courseCounter;
    uint256 public platformFeePercent = 5; // 5%平台手续费
    
    struct Course {
        uint256 id;
        string title;
        string description;
        string contentHash; // IPFS内容哈希
        uint256 price;      // CHM代币价格
        address instructor;
        bool isActive;
        uint256 studentsCount;
        uint256 createdAt;
        string[] tags;
        string thumbnailHash; // 课程缩略图IPFS哈希
        uint256 duration;     // 课程时长（分钟）
        string difficulty;    // 难度级别：Beginner, Intermediate, Advanced
    }
    
    struct Purchase {
        uint256 courseId;
        address student;
        uint256 timestamp;
        bool completed;
        uint8 rating; // 1-5星评分
        string review;
        uint256 progress; // 进度百分比 0-100
    }
    
    struct Instructor {
        string name;
        string bio;
        string profileHash; // IPFS个人资料哈希
        uint256 totalEarnings;
        uint256 courseCount;
        bool isVerified;
        string[] specialties; // 专业领域
        uint256 joinedAt;
    }
    
    mapping(uint256 => Course) public courses;
    mapping(address => mapping(uint256 => bool)) public hasPurchased;
    mapping(address => Purchase[]) public userPurchases;
    mapping(address => Instructor) public instructors;
    mapping(uint256 => Purchase[]) public coursePurchases;
    mapping(string => uint256[]) public tagToCourses; // 标签到课程ID的映射
    
    event CourseCreated(
        uint256 indexed courseId, 
        string title, 
        uint256 price, 
        address indexed instructor
    );
    event CoursePurchased(
        uint256 indexed courseId, 
        address indexed student, 
        uint256 price,
        uint256 timestamp
    );
    event CourseCompleted(
        uint256 indexed courseId, 
        address indexed student,
        uint8 rating,
        string review
    );
    event ProgressUpdated(
        uint256 indexed courseId,
        address indexed student,
        uint256 progress
    );
    event InstructorRegistered(address indexed instructor, string name);
    event CourseUpdated(uint256 indexed courseId, bool isActive);
    event PlatformFeeUpdated(uint256 newFeePercent);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    modifier onlyInstructor(uint256 _courseId) {
        require(courses[_courseId].instructor == msg.sender, "Not the course instructor");
        _;
    }
    
    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }
    
    bool public paused = false;
    
    constructor(address _chmTokenAddress) {
        chmToken = CHMToken(_chmTokenAddress);
        owner = msg.sender;
    }
    
    // 注册为讲师
    function registerInstructor(
        string memory _name,
        string memory _bio,
        string memory _profileHash,
        string[] memory _specialties
    ) external whenNotPaused {
        require(bytes(_name).length > 0, "Name cannot be empty");
        
        instructors[msg.sender] = Instructor({
            name: _name,
            bio: _bio,
            profileHash: _profileHash,
            totalEarnings: 0,
            courseCount: 0,
            isVerified: false,
            specialties: _specialties,
            joinedAt: block.timestamp
        });
        
        emit InstructorRegistered(msg.sender, _name);
    }
    
    // 验证讲师（仅所有者）
    function verifyInstructor(address _instructor) external onlyOwner {
        require(bytes(instructors[_instructor].name).length > 0, "Instructor not registered");
        instructors[_instructor].isVerified = true;
    }
    
    // 创建课程
    function createCourse(
        string memory _title,
        string memory _description,
        string memory _contentHash,
        uint256 _price,
        string[] memory _tags,
        string memory _thumbnailHash,
        uint256 _duration,
        string memory _difficulty
    ) external whenNotPaused {
        require(bytes(instructors[msg.sender].name).length > 0, "Must register as instructor first");
        require(_price > 0, "Price must be greater than 0");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_duration > 0, "Duration must be greater than 0");
        
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
            tags: _tags,
            thumbnailHash: _thumbnailHash,
            duration: _duration,
            difficulty: _difficulty
        });
        
        // 更新标签映射
        for (uint256 i = 0; i < _tags.length; i++) {
            tagToCourses[_tags[i]].push(courseCounter);
        }
        
        instructors[msg.sender].courseCount++;
        
        emit CourseCreated(courseCounter, _title, _price, msg.sender);
    }
    
    // 购买课程
    function purchaseCourse(uint256 _courseId) external whenNotPaused {
        Course storage course = courses[_courseId];
        require(course.isActive, "Course not active");
        require(_courseId > 0 && _courseId <= courseCounter, "Invalid course ID");
        require(!hasPurchased[msg.sender][_courseId], "Already purchased this course");
        require(chmToken.balanceOf(msg.sender) >= course.price, "Insufficient CHM tokens");
        require(msg.sender != course.instructor, "Instructor cannot buy own course");
        
        // 计算平台手续费
        uint256 platformFee = (course.price * platformFeePercent) / 100;
        uint256 instructorPayment = course.price - platformFee;
        
        // 转账CHM代币
        chmToken.transferFrom(msg.sender, course.instructor, instructorPayment);
        chmToken.transferFrom(msg.sender, address(this), platformFee);
        
        // 记录购买
        hasPurchased[msg.sender][_courseId] = true;
        
        Purchase memory newPurchase = Purchase({
            courseId: _courseId,
            student: msg.sender,
            timestamp: block.timestamp,
            completed: false,
            rating: 0,
            review: "",
            progress: 0
        });
        
        userPurchases[msg.sender].push(newPurchase);
        coursePurchases[_courseId].push(newPurchase);
        
        course.studentsCount++;
        instructors[course.instructor].totalEarnings += instructorPayment;
        
        emit CoursePurchased(_courseId, msg.sender, course.price, block.timestamp);
    }
    
    // 更新学习进度
    function updateProgress(uint256 _courseId, uint256 _progress) external whenNotPaused {
        require(hasPurchased[msg.sender][_courseId], "Course not purchased");
        require(_progress <= 100, "Progress cannot exceed 100%");
        
        // 更新用户购买记录中的进度
        Purchase[] storage purchases = userPurchases[msg.sender];
        for (uint256 i = 0; i < purchases.length; i++) {
            if (purchases[i].courseId == _courseId && purchases[i].student == msg.sender) {
                purchases[i].progress = _progress;
                break;
            }
        }
        
        // 更新课程购买记录中的进度
        Purchase[] storage coursePurchaseList = coursePurchases[_courseId];
        for (uint256 i = 0; i < coursePurchaseList.length; i++) {
            if (coursePurchaseList[i].student == msg.sender) {
                coursePurchaseList[i].progress = _progress;
                break;
            }
        }
        
        emit ProgressUpdated(_courseId, msg.sender, _progress);
    }
    
    // 完成课程并评分
    function completeCourse(
        uint256 _courseId,
        uint8 _rating,
        string memory _review
    ) external whenNotPaused {
        require(hasPurchased[msg.sender][_courseId], "Course not purchased");
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");
        
        // 找到对应的购买记录并更新
        Purchase[] storage purchases = userPurchases[msg.sender];
        for (uint256 i = 0; i < purchases.length; i++) {
            if (purchases[i].courseId == _courseId && purchases[i].student == msg.sender) {
                require(!purchases[i].completed, "Course already completed");
                purchases[i].completed = true;
                purchases[i].rating = _rating;
                purchases[i].review = _review;
                purchases[i].progress = 100; // 完成时进度设为100%
                break;
            }
        }
        
        // 同时更新课程购买记录
        Purchase[] storage coursePurchaseList = coursePurchases[_courseId];
        for (uint256 i = 0; i < coursePurchaseList.length; i++) {
            if (coursePurchaseList[i].student == msg.sender) {
                coursePurchaseList[i].completed = true;
                coursePurchaseList[i].rating = _rating;
                coursePurchaseList[i].review = _review;
                coursePurchaseList[i].progress = 100;
                break;
            }
        }
        
        emit CourseCompleted(_courseId, msg.sender, _rating, _review);
    }
    
    // 更新课程状态（仅讲师）
    function updateCourseStatus(uint256 _courseId, bool _isActive) 
        external 
        onlyInstructor(_courseId) 
        whenNotPaused
    {
        courses[_courseId].isActive = _isActive;
        emit CourseUpdated(_courseId, _isActive);
    }
    
    // 更新课程价格（仅讲师）
    function updateCoursePrice(uint256 _courseId, uint256 _newPrice) 
        external 
        onlyInstructor(_courseId) 
        whenNotPaused
    {
        require(_newPrice > 0, "Price must be greater than 0");
        courses[_courseId].price = _newPrice;
    }
    
    // 批量获取课程（分页）
    function getCoursesPaginated(uint256 _page, uint256 _pageSize) 
        external 
        view 
        returns (Course[] memory, uint256 totalPages) 
    {
        require(_pageSize > 0 && _pageSize <= 50, "Invalid page size");
        
        uint256 activeCount = 0;
        for (uint256 i = 1; i <= courseCounter; i++) {
            if (courses[i].isActive) {
                activeCount++;
            }
        }
        
        uint256 totalPagesCount = (activeCount + _pageSize - 1) / _pageSize;
        uint256 startIndex = _page * _pageSize;
        uint256 endIndex = startIndex + _pageSize;
        if (endIndex > activeCount) {
            endIndex = activeCount;
        }
        
        Course[] memory paginatedCourses = new Course[](endIndex > startIndex ? endIndex - startIndex : 0);
        uint256 currentIndex = 0;
        uint256 activeIndex = 0;
        
        for (uint256 i = 1; i <= courseCounter && currentIndex < paginatedCourses.length; i++) {
            if (courses[i].isActive) {
                if (activeIndex >= startIndex && activeIndex < endIndex) {
                    paginatedCourses[currentIndex] = courses[i];
                    currentIndex++;
                }
                activeIndex++;
            }
        }
        
        return (paginatedCourses, totalPagesCount);
    }
    
    // 获取所有活跃课程
    function getAllActiveCourses() external view returns (Course[] memory) {
        uint256 activeCount = 0;
        
        // 先计算活跃课程数量
        for (uint256 i = 1; i <= courseCounter; i++) {
            if (courses[i].isActive) {
                activeCount++;
            }
        }
        
        // 创建数组并填充
        Course[] memory activeCourses = new Course[](activeCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 1; i <= courseCounter; i++) {
            if (courses[i].isActive) {
                activeCourses[currentIndex] = courses[i];
                currentIndex++;
            }
        }
        
        return activeCourses;
    }
    
    // 获取用户购买的课程
    function getUserPurchases(address _user) external view returns (Purchase[] memory) {
        return userPurchases[_user];
    }
    
    // 获取课程的所有购买记录
    function getCoursePurchases(uint256 _courseId) external view returns (Purchase[] memory) {
        return coursePurchases[_courseId];
    }
    
    // 获取用户在特定课程的进度
    function getUserCourseProgress(address _user, uint256 _courseId) external view returns (uint256) {
        Purchase[] memory purchases = userPurchases[_user];
        for (uint256 i = 0; i < purchases.length; i++) {
            if (purchases[i].courseId == _courseId && purchases[i].student == _user) {
                return purchases[i].progress;
            }
        }
        return 0; // 未购买或未找到
    }
    
    // 获取讲师的所有课程
    function getInstructorCourses(address _instructor) external view returns (Course[] memory) {
        uint256 instructorCourseCount = 0;
        
        // 计算讲师课程数量
        for (uint256 i = 1; i <= courseCounter; i++) {
            if (courses[i].instructor == _instructor) {
                instructorCourseCount++;
            }
        }
        
        // 创建数组并填充
        Course[] memory instructorCourses = new Course[](instructorCourseCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 1; i <= courseCounter; i++) {
            if (courses[i].instructor == _instructor) {
                instructorCourses[currentIndex] = courses[i];
                currentIndex++;
            }
        }
        
        return instructorCourses;
    }
    
    // 获取课程评分统计
    function getCourseRating(uint256 _courseId) external view returns (
        uint256 totalRatings,
        uint256 averageRating,
        uint256 completedStudents
    ) {
        Purchase[] memory purchases = coursePurchases[_courseId];
        uint256 totalRatingSum = 0;
        uint256 ratedCount = 0;
        uint256 completedCount = 0;
        
        for (uint256 i = 0; i < purchases.length; i++) {
            if (purchases[i].completed) {
                completedCount++;
                if (purchases[i].rating > 0) {
                    totalRatingSum += purchases[i].rating;
                    ratedCount++;
                }
            }
        }
        
        return (
            ratedCount,
            ratedCount > 0 ? (totalRatingSum * 100) / ratedCount : 0, // 乘以100保留2位小数
            completedCount
        );
    }
    
    // 按标签搜索课程（优化版）
    function searchCoursesByTag(string memory _tag) external view returns (Course[] memory) {
        uint256[] memory courseIds = tagToCourses[_tag];
        uint256 activeCount = 0;
        
        // 计算活跃课程数量
        for (uint256 i = 0; i < courseIds.length; i++) {
            if (courses[courseIds[i]].isActive) {
                activeCount++;
            }
        }
        
        // 创建结果数组
        Course[] memory matchedCourses = new Course[](activeCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 0; i < courseIds.length; i++) {
            if (courses[courseIds[i]].isActive) {
                matchedCourses[currentIndex] = courses[courseIds[i]];
                currentIndex++;
            }
        }
        
        return matchedCourses;
    }
    
    // 按难度级别搜索课程
    function searchCoursesByDifficulty(string memory _difficulty) external view returns (Course[] memory) {
        uint256 matchCount = 0;
        
        // 计算匹配的课程数量
        for (uint256 i = 1; i <= courseCounter; i++) {
            if (courses[i].isActive && 
                keccak256(bytes(courses[i].difficulty)) == keccak256(bytes(_difficulty))) {
                matchCount++;
            }
        }
        
        // 创建结果数组
        Course[] memory matchedCourses = new Course[](matchCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 1; i <= courseCounter; i++) {
            if (courses[i].isActive && 
                keccak256(bytes(courses[i].difficulty)) == keccak256(bytes(_difficulty))) {
                matchedCourses[currentIndex] = courses[i];
                currentIndex++;
            }
        }
        
        return matchedCourses;
    }
    
    // 按价格范围搜索课程
    function searchCoursesByPriceRange(uint256 _minPrice, uint256 _maxPrice) 
        external 
        view 
        returns (Course[] memory) 
    {
        require(_minPrice <= _maxPrice, "Invalid price range");
        
        uint256 matchCount = 0;
        
        // 计算匹配的课程数量
        for (uint256 i = 1; i <= courseCounter; i++) {
            if (courses[i].isActive && 
                courses[i].price >= _minPrice && 
                courses[i].price <= _maxPrice) {
                matchCount++;
            }
        }
        
        // 创建结果数组
        Course[] memory matchedCourses = new Course[](matchCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 1; i <= courseCounter; i++) {
            if (courses[i].isActive && 
                courses[i].price >= _minPrice && 
                courses[i].price <= _maxPrice) {
                matchedCourses[currentIndex] = courses[i];
                currentIndex++;
            }
        }
        
        return matchedCourses;
    }
    
    // 更新平台手续费（仅所有者）
    function updatePlatformFee(uint256 _newFeePercent) external onlyOwner {
        require(_newFeePercent <= 10, "Fee cannot exceed 10%");
        platformFeePercent = _newFeePercent;
        emit PlatformFeeUpdated(_newFeePercent);
    }
    
    // 提取平台收益（仅所有者）
    function withdrawPlatformFees() external onlyOwner {
        uint256 balance = chmToken.balanceOf(address(this));
        require(balance > 0, "No fees to withdraw");
        chmToken.transfer(owner, balance);
    }
    
    // 获取平台收益余额
    function getPlatformFeesBalance() external view returns (uint256) {
        return chmToken.balanceOf(address(this));
    }
    
    // 获取平台统计信息
    function getPlatformStats() external view returns (
        uint256 totalCourses,
        uint256 activeCourses,
        uint256 totalPurchases,
        uint256 totalRevenue
    ) {
        uint256 active = 0;
        uint256 totalPurchaseCount = 0;
        uint256 revenue = 0;
        
        for (uint256 i = 1; i <= courseCounter; i++) {
            if (courses[i].isActive) {
                active++;
            }
            totalPurchaseCount += courses[i].studentsCount;
            revenue += courses[i].price * courses[i].studentsCount;
        }
        
        return (courseCounter, active, totalPurchaseCount, revenue);
    }
    
    // 紧急暂停功能
    function pause() external onlyOwner {
        paused = true;
    }
    
    function unpause() external onlyOwner {
        paused = false;
    }
    
    // 转移所有权
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "New owner cannot be zero address");
        owner = _newOwner;
    }
}