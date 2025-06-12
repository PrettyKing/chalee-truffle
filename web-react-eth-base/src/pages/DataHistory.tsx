import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';

const query = gql`{
  dataReceiveds(first: 5) {
    id
    data
    sender
    value
  }
  logs(first: 5) {
    id
    data
    blockNumber
    blockTimestamp
  }
}`
const url = 'https://api.studio.thegraph.com/query/113598/log-chain/version/latest'
const headers = { Authorization: 'Bearer 157ed63c453c24d03dfc12e849378b3e' };

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

export const DataHistory: React.FC = () => {
 const { data, status } = useQuery({
    queryKey: ['data'],
    async queryFn() {
      return await request(url, query, {}, headers)
    }
  })

  return (
    <QueryClientProvider client={queryClient}>
      {status === 'pending' ? <div>Loading...</div> : null}
      {status === 'error' ? <div>Error ocurred querying the Subgraph</div> : null}
      <div>{JSON.stringify(data ?? {})}</div>
    </QueryClientProvider>
  );
};
