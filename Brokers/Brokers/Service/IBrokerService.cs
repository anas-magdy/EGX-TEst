using Brokers.DTO;

namespace Brokers.Service
{
    public interface IBrokerService
    {
        Broker AddBroker(BrokerDTO newBroker);
        object GetAll(int page ,int size);
        Broker GetByCode(string code);
        bool UpdateBroker(string code, BrokerDTO updated);
        bool DeleteBroker(string code);
    }
}
