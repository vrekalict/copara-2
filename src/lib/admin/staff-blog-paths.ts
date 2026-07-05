import { buildStaffPath } from "@/lib/admin/staff-path";

export type StaffBlogPaths = {
  index: string;
  new: string;
};

export function getStaffBlogPaths(): StaffBlogPaths {
  return {
    index: buildStaffPath("/blog") ?? "/",
    new: buildStaffPath("/blog/new") ?? "/",
  };
}

export function staffBlogEditPath(paths: StaffBlogPaths, id: string) {
  return `${paths.index}/${id}/edit`;
}
