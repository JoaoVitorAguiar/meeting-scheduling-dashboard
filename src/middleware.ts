import { NextResponse, type NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

export async function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;
  const tokenCookie = request.cookies.get("meeting-scheduling");

  // Se não houver token, permite acesso a /Login e /Register
  if (!tokenCookie) {
    if (currentPath === "/Login" || currentPath === "/Register") {
      return NextResponse.next();
    }
    // Redireciona para / se tentar acessar outras páginas
    return NextResponse.redirect(new URL("/Login", request.url));
  }

  // Verifica se o token está expirado
  const token = tokenCookie.value;
  let isTokenExpired = false;

  try {
    const decodedToken = jwtDecode(token);
    const { exp } = decodedToken;

    // Verifica a expiração do token
    if (exp && new Date(exp * 1000) < new Date()) {
      isTokenExpired = true;
    }
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    isTokenExpired = true; // Se não conseguir decodificar, considera como expirado
  }

  // Se o token estiver expirado, redireciona para /
  if (isTokenExpired) {
    return NextResponse.redirect(new URL("/Login", request.url));
  }

  // Se houver token, redireciona para /
  if (currentPath === "/Login" || currentPath === "/Register") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next(); // Permite acesso a outras páginas
}

export const config = {
  matcher: ["/Login", "/Register", "/"],
};
