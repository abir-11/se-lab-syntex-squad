export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-8xl font-bold text-emerald-500">
        404
      </h1>

      <h2 className="mt-4 text-2xl font-semibold text-gray-900">
        Page Not Found
      </h2>

      <p className="mt-2 max-w-md text-gray-500">
        Sorry, the page you are looking for does not exist or may have been
        moved.
      </p>

      <a
        href="/"
        className="mt-6 rounded-lg bg-emerald-500 px-6 py-3 font-medium text-white transition hover:bg-emerald-600"
      >
        Back to Home
      </a>
    </main>
  );
}