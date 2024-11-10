import UsersList from '@/components/admin/users-list'
import { prisma } from '@/prisma'
import { MyUser } from '@/types'
import React from 'react'

const UsersPage = async() => {
  const response = await prisma.user.findMany()

  const users: MyUser[] = JSON.parse(JSON.stringify(response))
  return (
    <div>
      <UsersList users={users} />
    </div>
  )
}

export default UsersPage