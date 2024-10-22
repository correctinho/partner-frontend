import UserInfo from '@/app/components/userInfo/userInfo'
import styles from '../../../../components/userInfo/userInfo.module.css'
import { auth } from '@/app/lib/auth'

export default async function UserSettings() {
  const session = await auth();
  // Verificar se há uma sessão válida antes de renderizar o componente UserInfo

  return (
    <main className={styles.container}>
      <UserInfo
        uuid={session?.user.uuid ? session?.user.uuid : ''}
        is_admin={session?.user.is_admin ? session?.user.is_admin : false}
        document={session?.user.document ? session?.user.document : null}
        name={session?.user.name ? session?.user.name : null}
        email={session?.user.email ? session?.user.email : null}
        user_name={session?.user.user_name ? session?.user.user_name : null}
        function={session?.user.function ? session?.user.function : null}
        permissions={session?.user.permissions || []}
        status={session?.user.status ? session.user.status : null}
      />
    </main>
  );

}
