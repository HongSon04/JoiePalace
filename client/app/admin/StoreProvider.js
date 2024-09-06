"use client";

import { Provider } from "react-redux";
import store from "../_lib/store";

export default function StoreProvider({ children }) {
  // const storeRef = useRef();
  // if (!storeRef.current) {
  //   // Create the store instance the first time this renders
  //   storeRef.current = makeStore();
  // }

  return <Provider store={store}>{children}</Provider>;
}
