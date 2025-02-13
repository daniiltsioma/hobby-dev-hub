import { useEffect, useState } from "react";
import { getUser } from "./lib/user";

function App() {
    const [username, setUsername] = useState();

    useEffect(() => {
        async function fetchUsername() {
            const user = await getUser();
            setUsername(user.login);
        }

        fetchUsername();
    }, [[]]);

    return (
        <div>
            <div className="flex items-center justify-between bg-[#010409] border-b border-[#3d444d] px-8 py-4">
                <div className="flex items-center">
                    <div className="text-2xl font-bold">Hobby Dev Hub</div>
                </div>
                <div>
                    {username ? (
                        <>Welcome, {username}</>
                    ) : (
                        <a
                            href={`https://github.com/login/oauth/authorize?client_id=${
                                import.meta.env.VITE_GITHUB_APP_CLIENT_ID
                            }`}
                            className="bg-green-600 hover:bg-green-700 rounded-md py-2 px-4"
                        >
                            Login with Github
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
