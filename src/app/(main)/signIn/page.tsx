import SignIn from "@/components/Auth/signIn";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-base-darker px-4 py-12 text-base-light">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-2xl font-semibold text-text-primary">株レンズ へアクセスするには Google でサインインしてください</h1>
        <div className="flex justify-center">
          <SignIn />
        </div>
      </div>
    </main>
  );
}
