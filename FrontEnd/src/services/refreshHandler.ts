// refreshHandler.ts
export let triggerRefresh = () => {};
export function setTriggerRefresh(fn) {
  triggerRefresh = () => {
    console.log("triggerRefresh called");
    fn();
  };
}
