
function InputGroupInput({
  className,
  ...props
}) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "flex-1 rounded-none border-0 bg-transparent shadow-none outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:outline-none dark:bg-transparent",
        className
      )}
      {...props} />
  );
}
