import { useRouter } from 'next/router';

function ChiNhanhDetail() {
  const router = useRouter();
  const { id } = router.query;

  return <div>Chi nhánh chi tiết cho ID: {id}</div>;
}

export default ChiNhanhDetail;
