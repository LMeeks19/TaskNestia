namespace Server.Helpers
{
    public static class RandomHexColourGenerator
    {
        public static string GetRandomHexColor()
        {
            int color = Random.Shared.Next(0x1000000);
            return $"#{color:X6}";
        }
    }
}
