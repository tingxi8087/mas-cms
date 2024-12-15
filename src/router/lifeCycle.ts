
import { accessStore } from "@/store/sys";
import { NavigateFunction, Location } from "react-router-dom";
function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
export async function befroeCreated() {
  // await sleep(1000);
  accessStore.list = ["admin"];
  return true;
}
export const beforePageChange = async (
  navigate: NavigateFunction,
  location: Location<any>
) => {
  const { aceessValid } = await import("@/.utils/access");
  aceessValid(location, navigate);
  // await sleep(1000);
  return true;
};
