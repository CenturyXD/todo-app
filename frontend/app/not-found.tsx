"use client";

import React from "react";
import { Button, Result } from "antd";
import { useRouter } from "next/navigation";

const NotFoundPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb] px-3 py-6">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={() => router.push("/")}>
            Back Home
          </Button>
        }
      />
    </div>
  );
};

export default NotFoundPage;