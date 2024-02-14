public class orelopportunitystageclass {
  public static void oppostagemethod(list<Opportunity> oppolist)
  {
   Quote quo =[Select Id,Status,OpportunityId,CreatedDate From Quote Where OpportunityId in:trigger.new Order By CreatedDate desc Limit 1 ];
  for(Opportunity oppo:oppolist)
  {
       if(quo.Status!='Accepted'&& oppo.StageName=='Closed Won')
         {
             oppo.adderror('Quote Status should be Accepted');
         }
  }
  }
}