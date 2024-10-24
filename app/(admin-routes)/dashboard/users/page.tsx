import Search from "@/app/components/search/search";
import styles from './users.module.css'
import Link from "next/link";
import { deleteUser, fetchCompanyUsers } from "@/app/lib/actions";
import Pagination from "@/app/components/pagination/pagination";
import { auth } from "@/app/lib/auth";
import React from "react";
import { CircleHelp } from "lucide-react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Tooltip } from '@nextui-org/react';
import TeamList from "@/app/components/teamList/teamList";


export type CompanyUser = {
  uuid: string
  img: string | null
  is_admin: boolean
  user_name: string
  document: string | null
  permissions: string[]
  email: string | null
  function: string | null
  status: string
  token: string
}


const UsersPage = async ({ searchParams }: any) => {

  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;

  const session = await auth()

  const { users, count} = await fetchCompanyUsers(q, page, session!.user?.business_info_id);

  return (
    <div className={styles.container}>
      <TeamList users={users} count={count} />
    </div>);
};

export default UsersPage;
