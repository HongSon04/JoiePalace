import { Grid, Card, Image, Text, Stack, GridItem, Heading, Box } from '@chakra-ui/react';

export const metadata = {
  title: 'Chi nhánh',
};

function PageChiNhanh() {
  return (
    <Box>
      <Heading>Chi nhánh</Heading>
      <Grid
        templateColumns='repeat(3, 1fr)'
        gap='20'
        className='mt-8'
      >
        <GridItem w='100%' className='rounded-lg'>
          <Card maxW='sm'>
            <Image
              src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
              alt='Green double couch with wooden legs'
              borderRadius='sm'
              h='200px'
              w='100%'
              className='relative rounded-lg'
            />
            <Stack alignItems='center' spacing='3' className='absolute bottom-5 left-0 right-0'>
              <Text color='white' fontSize='2xl' py='8' px='10' bg='blue' className='rounded-lg'>
                Hoàng Văn Thụ
              </Text>
            </Stack>
          </Card>
        </GridItem>
        <GridItem w='100%' className='rounded-lg'>
          <Card maxW='sm'>
            <Image
              src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
              alt='Green double couch with wooden legs'
              borderRadius='sm'
              h='200px'
              w='100%'
              className='relative rounded-lg'
            />
            <Stack alignItems='center' spacing='3' className='absolute bottom-5 left-0 right-0'>
              <Text color='white' fontSize='2xl' py='8' px='10' bg='blue' className='rounded-lg'>
                Hoàng Văn Thụ
              </Text>
            </Stack>
          </Card>
        </GridItem>
        <GridItem w='100%' className='rounded-lg'>
          <Card maxW='sm'>
            <Image
              src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
              alt='Green double couch with wooden legs'
              borderRadius='sm'
              h='200px'
              w='100%'
              className='relative rounded-lg'
            />
            <Stack alignItems='center' spacing='3' className='absolute bottom-5 left-0 right-0'>
              <Text color='white' fontSize='2xl' py='8' px='10' bg='blue' className='rounded-lg'>
                Hoàng Văn Thụ
              </Text>
            </Stack>
          </Card>
        </GridItem>
      </Grid>
    </Box>
  );
}

export default PageChiNhanh;
