"use client";

import UsersTable from "./UsersTable";
import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect } from "react";
import { fetchAllUsersThunk } from "@/store/slices/usersSlice";

interface UsersListProps {
  onDetail?: (user: any) => void;
}

export default function UsersList({ onDetail }: UsersListProps) {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((s) => s.auth);
  const { users, status, error } = useAppSelector((s) => s.users);

  useEffect(() => {
    if (!token) return;
    dispatch<any>(fetchAllUsersThunk({ token }));
  }, [token, dispatch]);

  return (
    <UsersTable users={users} loading={status === "loading"} error={error} onDetail={onDetail} />
  );
}


