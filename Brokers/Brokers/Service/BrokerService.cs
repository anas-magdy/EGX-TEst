using Brokers.DTO;
using Brokers.models;
using Microsoft.AspNetCore.Mvc;

namespace Brokers.Service
{
    public class BrokerService:IBrokerService
    {
        private MyDbContext Db;
        public BrokerService(MyDbContext _dbContext)
        {
            this.Db = _dbContext;
        }
        public Broker? AddBroker(BrokerDTO newBroker)
        {
            var exists = Db.Brokers.Any(b => b.BrokerCode == newBroker.BrokerCode && !b.Isdeleted);

            if (exists)
            {
                return null;
            }

            var broker = new Broker
            {
                BrokerCode = newBroker.BrokerCode,
                BrokerLongName = newBroker.BrokerLongName,
                BrokerShortName = newBroker.BrokerShortName,
                BrokerNameEng = newBroker.BrokerNameEng,
                BrokerAddress = newBroker.BrokerAddress,
                BrokerTelephone = newBroker.BrokerTelephone,
                BrokerFax = newBroker.BrokerFax,
                SuspensionCode = newBroker.SuspensionCode,
                LastUpdateDate = DateTime.Now,
                Isdeleted = false
            };

            Db.Brokers.Add(broker);
            Db.SaveChanges();
            return broker;
        }


        public object GetAll(int page,int pageSize)
        {
            var query = Db.Brokers.Where(b => !b.Isdeleted);

            var totalCount = query.Count();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var data = query
                        .Skip((page - 1) * pageSize)
                        .Take(pageSize)
                        .ToList();
            return new
            {
                page,
                pageSize,
                totalCount,
                totalPages,
                data
            };
        }

        public Broker GetByCode(string code)
        {
            return Db.Brokers.FirstOrDefault(b => b.BrokerCode == code && !b.Isdeleted);
        }
        public bool UpdateBroker(string code, BrokerDTO updated)
        {
            var broker = Db.Brokers.FirstOrDefault(b => b.BrokerCode == code && !b.Isdeleted);
            if (broker == null)
                return false;

            broker.BrokerLongName = updated.BrokerLongName;
            broker.BrokerShortName = updated.BrokerShortName;
            broker.BrokerNameEng = updated.BrokerNameEng;
            broker.BrokerAddress = updated.BrokerAddress;
            broker.BrokerTelephone = updated.BrokerTelephone;
            broker.BrokerFax = updated.BrokerFax;
            broker.SuspensionCode = updated.SuspensionCode;
            broker.LastUpdateDate = DateTime.Now;

            Db.SaveChanges();
            return true;
        }
        public bool DeleteBroker(string code)
        {
            var broker = Db.Brokers.FirstOrDefault(b => b.BrokerCode == code && !b.Isdeleted);
            if (broker == null)
                return false;

            broker.Isdeleted = true;
            Db.SaveChanges();
            return true;
        }
    }
}
