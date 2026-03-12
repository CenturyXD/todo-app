"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Checkbox,
  Tag,
  Drawer,
  Form,
  Slider,
  Result,
  Popconfirm,
  Modal,
  Select,
} from "antd";
import {
  PlusOutlined,
  CloseCircleOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { useTodoPage } from "./useTodoPage";
import type { Todo, TodoPriority } from "@/domain/todo";

const priorityColor: Record<TodoPriority, string> = {
  Low: "blue",
  Medium: "orange",
  High: "red",
};

const priorityMap: Record<number, TodoPriority> = {
  1: "Low",
  2: "Medium",
  3: "High",
};

export function TodoPage() {
  const {
    todos,
    loading,
    initialLoading,
    error,
    handleAdd,
    handleToggle,
    handleDelete,
  } = useTodoPage();

  // Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [form] = Form.useForm();

  // Filter States
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState<TodoPriority[]>([]);
  const [tempFilterPriority, setTempFilterPriority] = useState<TodoPriority[]>([]);

  // --- Drawer Handlers ---
  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    form.resetFields();
  };

  const onSubmitDrawer = async () => {
    try {
      const values = await form.validateFields();
      const numericPriority =
        typeof values.priority === "number" ? values.priority : 2;
      const p = priorityMap[numericPriority as 1 | 2 | 3] ?? "Medium";

      await handleAdd({
        title: values.title,
        priority: p,
      });

      closeDrawer();
    } catch (err) {
      console.error("Validate Failed:", err);
    }
  };

  // --- Filter Handlers ---
  const handleOpenFilter = () => {
    setTempFilterPriority(filterPriority);
    setIsFilterModalOpen(true);
  };

  const handleSaveFilter = () => {
    setFilterPriority(tempFilterPriority);
    setIsFilterModalOpen(false);
  };

  const handleCancelFilter = () => {
    setIsFilterModalOpen(false);
  };

  // --- Logic ---
  const allDone = todos.length > 0 && todos.every((t) => t.completed);

  const visibleTodos = todos.filter((todo) => {
    if (filterPriority.length === 0) return true;
    return filterPriority.includes(todo.priority);
  });

  return (
    <div className="flex min-h-screen justify-center bg-[#f8fafc] px-4 py-16">
      <div className="w-full max-w-[500px]">
        {/* Header Layout: Title Left Alignment */}
        <div className="mb-2">
          <h1 className="text-4xl font-bold text-slate-800">Todos</h1>
        </div>

        {/* Filter Button (Right Aligned) */}
        {!initialLoading && todos.length > 0 && (
          <div className="mb-8 flex justify-end gap-2 items-center flex-wrap">
            {/* แสดง Tag รายการที่เลือกกรองอยู่ */}
            {filterPriority.map((p) => (
              <Tag
                key={p}
                closable
                onClose={() =>
                  setFilterPriority(filterPriority.filter((item) => item !== p))
                }
                color="blue"
                className="flex items-center m-0"
              >
                {p}
              </Tag>
            ))}

            <div
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-900/5 transition-hover hover:bg-slate-50 hover:text-slate-600 ${filterPriority.length > 0
                  ? "text-blue-500 ring-blue-100"
                  : "text-slate-400"
                }`}
              onClick={handleOpenFilter}
            >
              <FilterOutlined style={{ fontSize: 12 }} />
            </div>
          </div>
        )}

        {/* Status Text (Centered) */}
        <div className="flex h-8 items-center justify-center">
          {allDone ? (
            <span className="text-base font-medium text-slate-300">
              All Todos Done.
            </span>
          ) : (
            <span className="text-sm text-slate-300">
              {visibleTodos.filter((t) => !t.completed).length} tasks remaining
            </span>
          )}
        </div>

        {/* Divider Line */}
        <div className="mb-6 mt-4 border-b border-slate-100"></div>

        {/* Content Area */}
        {initialLoading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : visibleTodos.length === 0 ? (
          <Result
            status="info"
            title={filterPriority.length > 0 ? "No matches found" : "No todos"}
            subTitle={
              filterPriority.length > 0
                ? "Try changing the priority filter"
                : "Add a task to get started"
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {visibleTodos.map((todo: Todo) => {
              const isDone = todo.completed;
              const priority = todo.priority;

              return (
                <div
                  key={todo.id}
                  className={`group flex items-start gap-4 rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all ${isDone ? "opacity-60" : "hover:shadow-md"
                    }`}
                >
                  {/* Left: Delete Icon with Confirmation */}
                  <Popconfirm
                    title="Delete the task"
                    description="Are you sure to delete this task?"
                    onConfirm={() => handleDelete(todo.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <button
                      type="button"
                      className="mt-0.5 text-slate-300 transition-colors hover:text-red-500"
                    >
                      <CloseCircleOutlined style={{ fontSize: 18 }} />
                    </button>
                  </Popconfirm>

                  {/* Middle: Content */}
                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <div className="text-[16px] font-semibold text-slate-600">
                      {todo.title}
                    </div>

                    {/* Tag below title */}
                    <div className="mt-2">
                      <Tag
                        color={priorityColor[priority]}
                        style={{
                          background: "transparent",
                          borderWidth: 1,
                        }}
                        className="m-0"
                      >
                        {priority}
                      </Tag>
                    </div>
                  </div>

                  {/* Right: Checkbox */}
                  <div className="mt-1">
                    <Checkbox
                      checked={isDone}
                      onChange={() => handleToggle(todo.id)}
                      className="[&_.ant-checkbox-inner]:!h-5 [&_.ant-checkbox-inner]:!w-5 [&_.ant-checkbox-inner]:!rounded-[4px] [&_.ant-checkbox-inner]:!border-slate-300"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- Modals & Drawers --- */}

        {/* Filter Modal */}
        <Modal
          title="Filter Todos"
          open={isFilterModalOpen}
          onCancel={handleCancelFilter}
          footer={[
            <Button key="cancel" onClick={handleCancelFilter}>
              Cancel
            </Button>,
            <Button key="save" type="primary" onClick={handleSaveFilter}>
              Save
            </Button>,
          ]}
          width={400}
        >
          <div className="py-4">
            <h4 className="mb-2 text-sm text-slate-500">Priority</h4>
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Select Priority"
              allowClear
              value={tempFilterPriority}
              onChange={(value) => setTempFilterPriority(value as TodoPriority[])}
              options={[
                { value: "Low", label: "Low" },
                { value: "Medium", label: "Medium" },
                { value: "High", label: "High" },
              ]}
            />
          </div>
        </Modal>

        {/* Add Task Drawer */}
        <Drawer
          title="Add New Task"
          open={isDrawerOpen}
          onClose={closeDrawer}
          destroyOnClose
        >
          <Form layout="vertical" form={form} onFinish={onSubmitDrawer}>
            <Form.Item
              label="Task Name"
              name="title"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input size="large" placeholder="What needs to be done?" />
            </Form.Item>

            <Form.Item label="Label" name="label">
              <Input size="large" placeholder="Category (e.g. Home, Work)" />
            </Form.Item>

            <Form.Item label="Priority" name="priority" initialValue={2}>
              <Slider
                min={1}
                max={3}
                marks={{ 1: "Low", 2: "Medium", 3: "High" }}
                tooltip={{ open: false }}
              />
            </Form.Item>

            <Form.Item className="mt-8">
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
                className="h-12 text-base font-medium"
              >
                Create Task
              </Button>
            </Form.Item>
          </Form>
        </Drawer>
      </div>

      {/* Floating Add Button */}
      <Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined />}
        size="large"
        className="shadow-lg shadow-blue-500/30"
        style={{
          position: "fixed",
          bottom: 40,
          right: 40,
          width: 56,
          height: 56,
          zIndex: 999,
        }}
        onClick={openDrawer}
      />
    </div>
  );
}