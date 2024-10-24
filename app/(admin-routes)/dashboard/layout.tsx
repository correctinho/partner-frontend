import NavBar from "@/app/components/navBar/navBar"
import SideBar from "@/app/components/sidebar/sidebar"
import styles from '../../ui/dashboard/dashboard.module.css'
import Footer from "@/app/components/footer/footer"
import { ReactNode } from "react"
import BackButton from "@/app/components/backButton/backbutton"

import { FaChevronLeft } from "react-icons/fa6"


interface LayoutProps {
  children: ReactNode
}

const Layout = async ({ children }: LayoutProps) => {

  return (

    <div className={styles.container}>
      <input className={styles.activeSidebar} type="checkbox" id="activeSidebar" />
      <div className={styles.menu}>
        <SideBar />
      </div>
      <div className={styles.menuButton}>
        <label htmlFor="activeSidebar">
          <FaChevronLeft height={8} width={2} />
        </label>
      </div>
      <div className={styles.content}>
        <NavBar />
        <BackButton />
        {children}
        <Footer />
      </div>

    </div>
  )
}

export default Layout
