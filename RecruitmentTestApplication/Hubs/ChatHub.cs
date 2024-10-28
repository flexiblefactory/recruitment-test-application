using System;

using Microsoft.AspNetCore.SignalR;

namespace RecruitmentTestApplication.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task NotifyDataChange()
        {
            await Clients.All.SendAsync("DataChanged");
        }
    }
}
