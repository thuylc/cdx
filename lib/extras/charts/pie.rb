class Extras::Charts::Pie
  def initialize(options)
    @columns = options.fetch(:columns, [])
  end

  def render
    {
      theme: "theme3",
      animationEnabled: true,
      data: [
        {
          type: "doughnut",
          startAngle: 60,
          toolTipContent: "{legendText}: {y} - #percent% ",
          showInLegend: true,
          dataPoints: @columns
        }
      ]
    }
  end
end
