import Login from '@/components/components/Login';

type Props = {};

const page = (props: Props) => {
  return (
    <div className="flex flex-col gap-8 justify-center items-center h-[100vh] ">
      <Login />
    </div>
  );
};

export default page;
