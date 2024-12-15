// import global css styles
import "@/app/_styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import StoreProvider from "./admin/StoreProvider";
import { Providers } from "./providers";
import QueryClientContextProvider from "./_providers/QueryClientContextProvider";

// metadata for the layout
export const metadata = {
  title: {
    template: "%s - Joie Palace",
    default: "Welcome - Joie Palace",
  },
  description:
    "Luxurious and modern hotel located in the heart of the city. We offer the best services and amenities for our guests.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vn">
      <body>
        <QueryClientContextProvider>
          <StoreProvider>
            <ChakraProvider>
              <Providers>{children}</Providers>
            </ChakraProvider>
          </StoreProvider>
        </QueryClientContextProvider>
      </body>
    </html>
  );
}
