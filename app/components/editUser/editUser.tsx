// import { addU
'use client'

import { editUser } from '@/app/lib/actions';
import styles from './editUser.module.css'
import Switch from 'react-switch'
import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { CompanyUser } from '@/app/(admin-routes)/dashboard/users/page';
import { CircleHelp } from 'lucide-react';
import { ButtonComp } from '../Forms/Buttons/button';
import { toast } from 'react-toastify';

type FormErrors = {
  [key: string]: string[] | undefined;
} | null;

const EditUserForm = (data: { user: CompanyUser }) => {
  const [errorsMessage, setErrorsMessage] = useState<FormErrors>({})
  const [permissions, setPermissions] = useState<string[]>(data.user?.permissions);

  const handleRoleToggle = (permission: string) => {
    handleRemoveError('permissions')

    if (permissions.includes(permission)) {
      setPermissions(permissions.filter((r) => r !== permission));
    } else {
      setPermissions([...permissions, permission]);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    const user_name = formData.get('user_name') as string
    const password = formData.get('password') as string
    const sales = formData.get('sales') as string
    const finances = formData.get('finances') as string
    const marketing = formData.get('marketing') as string



    const status = validationStatus(user_name, password, sales, finances, marketing)

    if(status){
      const response = await editUser(formData)

      if(response.data){
        if(response.data === "User name already registered"){
          toast.error("Usuário já cadastrado")
          return
        }
      }
    }

  }

  const validationStatus = (user_name: string, password: string, sales: string, finances: string, marketing: string) => {
    const newErrors: FormErrors = {};

    if (permissions.length > 0 || user_name || password) return true

    if (permissions.length === 0) {
      newErrors.permissions = ['Selecione pelo menos uma opção']
    }
    if (!user_name) {
      newErrors.user_name = ['Este campo é obrigatório'];
    }
   if (password && password.length < 6) {
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
        <input type="hidden" name="user_id" value={data.user?.uuid} />
        <input type="hidden" name="permissions" value={JSON.stringify(permissions)} />
        <input type="text" placeholder={data.user?.user_name} name="user_name" className={styles.username} onChange={(e) => handleRemoveError('user_name')} />
        <input
          type="password"
          placeholder="Senha"
          name="password"
          onChange={(e) => handleRemoveError('password')}
        />
        <select name="is_active" id="isActive">
          <option selected={data.user?.status === "active"}>Ativo</option>
          <option selected={data.user?.status === "inactive"}>Inativo</option>

        </select>
        <div className={styles.toggles}>
          <div className={styles.switchBox}>
            <label>
              Vendas
            </label>
            <Switch
              onChange={() => handleRoleToggle("sales")}
              checked={permissions?.includes("sales")}
              name='sales'
            />
          </div>
          <div className={styles.switchBox}>
            <label>
              Finanças
            </label>
            <Switch
              onChange={() => handleRoleToggle("finances")}
              checked={permissions?.includes("finances")}
              name='finances'
            />
          </div>
          <div className={styles.switchBox}>
            <label>
              Marketing
            </label>
            <Switch
              onChange={() => handleRoleToggle("marketing")}
              checked={permissions?.includes("marketing")}
              name='marketing'
            />
          </div>

        </div>
        {errorsMessage?.permissions && (
          <span style={{ color: 'red' }}>{errorsMessage.permissions}</span>
        )}
        {errorsMessage?.allEmpty && (
          <span style={{ color: 'red' }}>{errorsMessage.allEmpty}</span>
        )}
        <ButtonComp>Editar Usuário</ButtonComp>
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
export default EditUserForm;
