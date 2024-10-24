'use client'

import Link from "next/link";
import styles from '../../(admin-routes)/dashboard/users/users.module.css'
import Search from "@/app/components/search/search";
import { CircleHelp } from "lucide-react";
import { deleteUser } from "@/app/lib/actions";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Tooltip, RadioGroup, Radio } from '@nextui-org/react';
import { CompanyUser } from "@/app/(admin-routes)/dashboard/users/page";
import Pagination from "../pagination/pagination";
import React from "react";

type TeamListProps = {
  users: CompanyUser[];
  count: number;
};
const TeamList: React.FC<TeamListProps> = ({ users, count }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();


  return (
    <div className={styles.container}>

      <div className={styles.top}>
        <Search placeholder="Buscar por usuário..." />
        <Link href="/dashboard/users/add">
          <button className={styles.addButton}>Adicionar novo</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Nome</td>
            <td>Permissões</td>
            <td className={styles.status}>Status
              <Tooltip content={
                <div className={styles.tooltipBox}>
                  <div className="text-small font-bold">
                    <h4>Ativo</h4>
                    <p>O usuário possui acesso de acordo com as Permissões.</p>
                  </div>
                  <div className="text-small font-bold">
                    <h4>Inativo</h4>
                    <p>O usuário não é capaz de realizar o login.</p>
                  </div>
                </div>
              }>
                <CircleHelp className={styles.hintMark} />
              </Tooltip>
            </td>
            <td>Ações</td>
          </tr>
        </thead>
        <tbody>
          {users?.map((user: CompanyUser) => (
            <tr key={user.uuid}>
              <td>
                <div className={styles.user}>
                  {/* <Image
                    src={user.img || "/noavatar.png"}
                    alt=""
                    width={40}
                    height={40}
                    className={styles.userImage}
                  /> */}
                  {user.user_name}
                </div>
              </td>
              <td>
                <ul>
                  {user.permissions.map((permission, index) => (
                    <li key={index}>
                      {permission === "sales" && "Vendas"}
                      {permission === "marketing" && "Marketing"}
                      {permission === "finances" && "Finanças"}
                    </li>
                  ))}
                </ul>
              </td>
              <td>{user.status === 'active' ? "Ativo" : user.status === "inactive" ? "Inativo" : ""}</td>
              <td>
                <div className={styles.buttons}>
                  <Link href={`/dashboard/users/${user.uuid}`}>
                    <button className={`${styles.button} ${styles.view}`}>
                      Editar
                    </button>
                  </Link>
                  {/* <form action={deleteUser}>
                    <input type="hidden" name="id" value={(user.uuid)} /> */}
                    <Button onPress={onOpen} className={`${styles.button} ${styles.delete}`}>
                      Deletar
                    </Button>

                    <Modal
                      isOpen={isOpen}
                      placement="top-center"
                      onOpenChange={onOpenChange}
                      className={styles.deleteModal}
                    >
                      <ModalContent>
                        {(onClose) => (
                          <>
                            <ModalHeader className="flex flex-col gap-1">Tem certeza que deseja deletar este usuário?</ModalHeader>
                            <ModalBody>
                              <p>
                                Esta ação não poderá ser desfeita.
                              </p>

                            </ModalBody>
                            <ModalFooter className={styles.deleteModalFooter}>
                              <Button className={styles.button} variant="light" onPress={onClose}>
                                Cancelar
                              </Button>
                              <form action={deleteUser}>
                                <input type="hidden" name="id" value={(user.uuid)} />
                                <Button type='submit' className={`${styles.button} ${styles.delete}`} onPress={onClose} >
                                  Deletar
                                </Button>
                              </form>
                            </ModalFooter>
                          </>
                        )}
                      </ModalContent>
                    </Modal>
                  {/* </form> */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination count={count} />
    </div>);
};

export default TeamList
