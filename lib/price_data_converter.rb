class PriceDataConverter
  def initialize(resolution, start=nil, stop=nil)
    @resolution = resolution
    @start = start
    @stop = stop
    @data = fetch_data
    select_range
  end

  def data
    @data
  end

  def select_range
    return @data if @start < 1
    @data.select! { |datapoint| matches_range?(datapoint) }
  end

  def aggregate_data_points(numDataPoints)
    newData = []
    dataSize = @data.size()
    stepSize = dataSize/numDataPoints
    return @data if stepSize <= 1

    0.step(dataSize-1, stepSize) do |i|
      slice = @data.slice(i, stepSize)
      datapoint = {
        "time" => slice.first["time"],
        "close" => slice.last["close"],
        "high" => slice.max_by { |a| a["high"] }["high"],
        "low" => slice.min_by {|a| a["low"]}["low"],
        "open" => slice.first["open"]
      }
      newData.push(datapoint) unless datapoint["close"] == 0
    end

    @data = newData.to_json
  end

  private

  def matches_range?(datapoint)
    datapoint["time"]>@start && datapoint["time"]<@stop
  end

  def fetch_data
    JSON.parse($redis.get("price/#{@resolution}"))
  end
end
