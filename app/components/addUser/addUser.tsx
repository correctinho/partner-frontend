// import { addU
'use client'

import styles from './singleUser.module.css'
import Switch from 'react-switch'
import { useState } from 'react';
import { ButtonComp } from '../Forms/Buttons/button';
import { addUser } from '@/app/lib/actions';
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify';
type FormErrors = {
  [key: string]: string[] | undefined;
} | null;


const AddUserForm = () => {
  const [errorsMessage, setErrorsMessage] = useState<FormErrors>({})
  const [permissions, setPermissions] = useState<string[]>([]);

  const router = useRouter()

  const handleRoleToggle = (permission: string) => {
    handleRemoveError('permissions')
    if (permissions.includes(permission)) {
      setPermissions(permissions.filter((r) => r !== permission));
      console.log(permission)
    } else {
      setPermissions([...permissions, permission]);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    const user_name = formData.get('user_name') as string
    const password = formData.get('password') as string
    const status = validationStatus(user_name, password)

    if (!status) return
    const response = await addUser(formData)
    console.log({ response })
    if (response?.status === 201) {
      router.replace("/dashboard/users")
      return
    } else {
      if (response?.data === "User name already registered") {
        toast.error("Nome de usuário já cadastro")
        router.refresh() //refreshe to make sure that user will not press many times
        return
      }
    }

    //refresh in case some unexpected error happens
    router.refresh()

  }

  const validationStatus = (user_name: string, password: string) => {
    const newErrors: FormErrors = {};

    if (permissions.length > 0 && user_name && password) return true

    if (permissions.length === 0) {
      newErrors.permissions = ['Selecione pelo menos uma opção']
    }
    if (!user_name) {
      newErrors.user_name = ['Este campo é obrigatório'];
    }
    if (!password) {
      newErrors.password = ['Este campo é obrigatório'];
    } else if (password.length < 6) {
      newErrors.password = ['A senha deve ter pelo menos 6 caracteres'];
    }
    setErrorsMessage(newErrors);
    return false
  }

  const handleRemoveError = (field: string) => {
    if (errorsMessage) {
      const updatedErrors = { ...errorsMessage };
      delete updatedErrors[field];
      setErrorsMessage(updatedErrors);
    }
  };
  return (
    <div className={styles.container}>

      <form action={handleSubmit} className={styles.form}>
        <input type="hidden" name="permissions" value={JSON.stringify(permissions)} />
        <div className={styles.inputBox}>
          <input
            type="text"
            placeholder="Nome do usuário"
            name="user_name"
            onChange={(e) => handleRemoveError('user_name')}
          />
          {errorsMessage?.user_name && (
            <span style={{ color: 'red' }}>{errorsMessage.user_name}</span>
          )}
        </div>
        <div className={styles.inputBox}>
          <input
            type="password"
            placeholder="Senha"
            name="password"
            onChange={(e) => handleRemoveError('password')}
          />
          {errorsMessage?.password && (
            <span style={{ color: 'red' }}>{errorsMessage.password}</span>
          )}

        </div>
        <div className={styles.toggles}>
          <div className={styles.switchBox}>
            <label>
              Vendas
            </label>
            <Switch
              onChange={() => handleRoleToggle("sales")}
              checked={permissions.includes("sales")}
            />
          </div>
          <div className={styles.switchBox}>
            <label>
              Finanças
            </label>
            <Switch
              onChange={() => handleRoleToggle("finances")}
              checked={permissions.includes("finances")}
            />
          </div>
          <div className={styles.switchBox}>
            <label>
              Marketing
            </label>
            <Switch
              onChange={() => handleRoleToggle("marketing")}
              checked={permissions.includes("marketing")}
            />
          </div>
        </div>
        {errorsMessage?.permissions && (
          <span style={{ color: 'red' }}>{errorsMessage.permissions}</span>
        )}

        <ButtonComp>Criar Usuário</ButtonComp>
      </form>
      <div className={styles.permissionsDetails}>
        <h1>Permissões</h1>
        <div className={styles.permissionType}>
          <h3>Vendas</h3>
          <ul>
            <li>
              Acesso ao PDV para processamento de pagamentos no caixa
            </li>
          </ul>
        </div>
        <div className={styles.permissionType}>
          <h3>Finanças</h3>
          <ul>
            <li>
              Ver e Editar: Relatórios, Transações.
            </li>
          </ul>
        </div>
        <div className={styles.permissionType}>
          <h3>Marketing</h3>
          <ul>
            <li>
              Ver e Editar: Relatórios, Transações.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default AddUserForm;
