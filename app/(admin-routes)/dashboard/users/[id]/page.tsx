import { fetchSingleUser } from '@/app/lib/actions';
import { CompanyUser } from '../page';
import EditUserForm from '@/app/components/editUser/editUser';
import { auth } from '@/app/lib/auth';


const SingleUserPage = async ({ params }: {params: {
  id: string
}}) => {

  const { id } = params
  const response  = await fetchSingleUser(id);

  const user = response?.data as CompanyUser
  return (
    <EditUserForm user={user}/>
  );
};

export default SingleUserPage
