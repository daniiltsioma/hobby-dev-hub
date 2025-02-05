import { getUser } from "./lib/dal";

export default async function Home() {
    const user = await getUser();

    return (
        <div className="flex items-center justify-between px-8 py-4">
            <div className="text-2xl font-bold">Hobby Dev Hub</div>
            <div>
                {user ? (
                    <div className="flex items-center">
                        Welcome, {user.data.login}
                        <a
                            href="/api/logout"
                            className="border hover:bg-red-100 border-red-600 text-red-600 py-1 px-4 rounded-md ml-4"
                        >
                            Logout
                        </a>
                    </div>
                ) : (
                    <a
                        href={`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_APP_CLIENT_ID}`}
                        className="bg-green-600 hover:bg-green-700  text-white py-2 px-4 rounded-md"
                    >
                        Login with Github
                    </a>
                )}
            </div>
        </div>
    );
}
