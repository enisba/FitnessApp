namespace FitnessApp.Permissions
{
    public static class FitnessPermissions
    {
        public const string GroupName = "Fitness";
        public static class Exercises
        {
            public const string Default = GroupName + ".Exercises";
            public const string Create = Default + ".Create";
            public const string Update = Default + ".Update";
            public const string Delete = Default + ".Delete";
        }
    }
}
