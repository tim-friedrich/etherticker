class FetchPriceData
  require 'net/http'

  @queue = :fetch_data
  @base_url = "https://min-api.cryptocompare.com/data/"

  def self.perform
    ActiveRecord::Base.clear_active_connections!
    fetch_month
    puts "fetched data"
  end

  def self.fetch_month
    url = URI(@base_url + "histoday?fsym=ETH&tsym=USD&limit=30&aggregate=1")
    respond = JSON.parse(Net::HTTP.get(url))
    # TODO error handling
    unless respond && respond['Response'] == "Success"
      puts "failed to fetch monthly data"
      return
    end
    save_data('month_price', respond["Data"])
    return respond["Data"]
  end



  def self.save_data(key, data)
    $redis.set(key, data)
  end
end
