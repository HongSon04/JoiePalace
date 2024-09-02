
import AdminHeader from '@/app/_components/AdminHeader';
import { Grid, Card, Image, Text, Stack, GridItem, Heading, Box } from '@chakra-ui/react';
import { Col } from 'antd';
import Link from 'next/link';
export const metadata = {
  title: 'Chi nhánh',
};

function PageChiNhanh() {
  return (
    <Box>
    <AdminHeader showBackButton={false}  title={'Chi nhánh'} />
      <Stack alignItems="start" spacing="8" direction={'row'} className='mt-5' >
        <Heading as='h1' size='lg' className=''>Chi nhánh / </Heading>
      </Stack>
      <Grid
        templateColumns="repeat(3, 1fr)"
        gap="20"
        className="mt-8"
      >
        <GridItem w="100%" className="rounded-lg product-card">
          <Card maxW="sm" className="overflow-hidden relative group">
            <Image
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
              alt="Green double couch with wooden legs"
              h="200px"
              w="100%"
              className="rounded-lg "
            />
            <Stack
              alignItems="center"
              spacing="3"
              className="absolute bottom-0 left-0 right-0 transform"
            >
              <Text color='white' fontSize='2xl' py='8' px='10' className='bg-blackAlpha-600 rounded-lg transition-transform duration-300 group-hover:-translate-y-6'>
                Hoàng Văn Thụ
              </Text>
              <Link href='' className='translate-y-full transition-transform duration-300 group-hover:-translate-y-4 w-fit bg-white text-black font-medium px-6 py-2 rounded-xl '>
                Chi tiết
              </Link>
            </Stack>
          </Card>
        </GridItem>
      </Grid>
      <div className='h-48 flex w-full rounded-lg items-center justify-center bg-whiteAlpha-100 mt-5'>
        <Link href='/admin/chi-nhanh/add' className='p-5 size-5 flex items-center justify-center rounded-full text-xl font-semibold   border hover:bg-whiteAlpha-400 hover:border-none transition-all'>
          +
        </Link>
      </div>
    </Box>
  );
}

export default PageChiNhanh;
