const data = [
  {
    icon: "mdi-account-group",
    title: "Пользователи",
    permission: ["ADMIN"],
    child: [
      {
        title: "Список пользователей",
        to: "/users",
      },
    ],
  },
  {
    icon: "mdi-cog-outline",
    title: "Профиль",
    to: "/profile",
    permission: ["ADMIN", "MANAGER"],
    child: [
      {
        title: "Профиль",
        to: "/profile",
      },
    ],
  },
];

const getNavByRole = (role) => {
  return data
    .map((item) => {
      // if (item.permission && item.permission.indexOf(role) === -1) return false; // TODO uncomment

      let newItem = JSON.parse(JSON.stringify(item));
      newItem.child = newItem.child.filter(
        (child) => !child.permission || child.permission.indexOf(role) !== -1
      );
      return newItem;
    })
    .filter((item) => item);
};
export { getNavByRole };
