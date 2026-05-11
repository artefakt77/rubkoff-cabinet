import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col justify-center px-6 py-16">
      <p className="text-center text-sm font-medium uppercase tracking-wide text-stone-500">
        ГК Рубкофф
      </p>
      <h1 className="mt-2 text-center text-2xl font-semibold text-stone-900">
        Личный кабинет клиента
      </h1>
      <p className="mt-2 text-center text-sm text-stone-600">
        Введите номер договора и телефон, указанные в договоре.
      </p>

      <LoginForm />
    </main>
  );
}
