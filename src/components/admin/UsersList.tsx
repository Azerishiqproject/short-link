"use client";

import UsersTable from "./UsersTable";
import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { fetchAllUsersThunk } from "@/store/slices/usersSlice";

interface UsersListProps {
  onDetail?: (user: any) => void;
}

export default function UsersList({ onDetail }: UsersListProps) {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((s) => s.auth);
  const { users, status, error, pagination } = useAppSelector((s) => s.users);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    if (!token) return;
    dispatch<any>(fetchAllUsersThunk({ token, page: currentPage, limit: pageSize }));
  }, [token, dispatch, currentPage, pageSize]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1">
        <UsersTable 
          users={users} 
          loading={status === "loading"} 
          error={error} 
          onDetail={onDetail}
          pagination={undefined}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}


