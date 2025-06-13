import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { THEGRAP_KEY } from '@/config/constant.env.local';

const query = gql`
  {
    dataReceiveds(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
      id
      data
      sender
      value
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;
const url = 'https://api.studio.thegraph.com/query/113598/log-chain/version/latest';
const headers = { Authorization: `Bearer ${THEGRAP_KEY}` };

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

export const DataHistory: React.FC = () => {
  const { data, status }: any = useQuery({
    queryKey: ['data'],
    async queryFn() {
      return await request(url, query, {}, headers);
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {status === 'pending' ? <Loading /> : null}
      {status === 'error' ? <Error /> : null}
      {status === 'success' && data.dataReceiveds.length > 0 && (
        <div className="list-disc pl-5 w-3/4 mx-auto">
          {data.dataReceiveds.map((item: any) => (
            <div key={item.id} className="mb-4 bg-white shadow-md rounded-lg p-4">
              <strong>Data:</strong> {item.data} <br />
              <strong>Sender:</strong> {item.sender} <br />
              <strong>Value:</strong> {item.value} <br />
              <strong>Block Number:</strong> {item.blockNumber} <br />
              <strong>Block Timestamp:</strong>{' '}
              {new Date(item.blockTimestamp * 1000).toLocaleString()} <br />
              <strong>Transaction Hash:</strong> {item.transactionHash} <br />
              <strong>ID:</strong> {item.id} <br />
              <a
                className="text-blue-500"
                href={`https://sepolia.etherscan.io//tx/${item.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Etherscan
              </a>
            </div>
          ))}
        </div>
      )}
    </QueryClientProvider>
  );
};

function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
    </div>
  );
}

function Error() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-red-500">Error ocurred querying the Subgraph</div>
    </div>
  );
}
