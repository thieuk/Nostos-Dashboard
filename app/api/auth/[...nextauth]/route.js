import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const users = [
    { email: "admin@mst.edu", password: "admin123" } 
];

const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                const user = users.find(user => user.email === credentials.email);

                if (user && user.password === credentials.password) {
                    return user; 
                }

                return null; 
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt", 
        maxAge: 30 * 24 * 60 * 60, // Session duration (30 days)
    },
    pages: {
        signIn: '/login'
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
