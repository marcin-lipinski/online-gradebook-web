using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace Application.EmailSender
{
    public class Email
    {
        private SmtpClient _smtp;
        private MailMessage _mail;

        private string _hostSmtp = "smtp.gmail.com";
        private bool _enableSsl = true;
        private int _port = 587;
        private string _senderEmail = "eperkins.manager@gmail.com";
        private string _senderEmailPassword = "carubcqsuqrlwldq";
        private string _senderName = "ePerkins";

        public async Task Send(string subject, string body, string to)
        {
            _mail = new MailMessage();
            _mail.From = new MailAddress(_senderEmail, _senderName);
            _mail.To.Add(new MailAddress(to));
            _mail.IsBodyHtml = true;
            _mail.Subject = subject;
            _mail.BodyEncoding = Encoding.UTF8;
            _mail.SubjectEncoding = Encoding.UTF8;
            _mail.Body = body;

            _smtp = new SmtpClient
            {
                Host = _hostSmtp,
                EnableSsl = _enableSsl,
                Port = _port,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(_senderEmail, _senderEmailPassword)
            };

            _smtp.SendCompleted += OnSendCompleted;

            await _smtp.SendMailAsync(_mail);
        }

        private void OnSendCompleted(object sender, System.ComponentModel.AsyncCompletedEventArgs e)
        {
            _smtp.Dispose();
            _mail.Dispose();
        }
    }
}