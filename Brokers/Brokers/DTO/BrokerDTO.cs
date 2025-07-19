using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Brokers.DTO
{
    public class BrokerDTO
    {
        [Key]
        [Column("BROKER_CODE")]
        public string BrokerCode { get; set; }

        [Column("BROKER_LONG_NAME")]
        public string BrokerLongName { get; set; }

        [Column("BROKER_SHORT_NAME")]
        public string BrokerShortName { get; set; }

        [Column("BROKER_NAME_ENG")]
        public string BrokerNameEng { get; set; }

        [Column("BROKER_ADDRESS")]
        public string BrokerAddress { get; set; }

        [Column("BROK_TEL1")]
        public string BrokerTelephone { get; set; }

        [Column("BROK_FAX")]
        public string BrokerFax { get; set; }

        [Column("SUSPENSION_CODE")]
        public string SuspensionCode { get; set; }
    }
}
