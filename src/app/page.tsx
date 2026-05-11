import { redirect } from "next/navigation";

/** Главная «/» сразу ведёт на страницу входа в кабинет */
export default function Home() {
  redirect("/login");
}
