class Extras::Charts::HorizontalColumns
  def initialize(options)
    @title   = options.fetch(:title, '')
    @titleY  = options.fetch(:titleY, '')
    @titleY2 = options.fetch(:titleY2, '')
    @columns = options.fetch(:columns, [])
  end

  def render
    {
      axisX:{
        interval: 1,
        gridThickness: 0,
        labelFontSize: 10,
        labelFontStyle: "normal",
        labelFontWeight: "normal",
        labelFontFamily: "Lucida Sans Unicode"
      },
      axisY2: {
        interlacedColor: "rgba(1,77,101,.2)",
        gridColor: "rgba(1,77,101,.1)"
      },

      data: [
        {
          type: "bar",
          name: @titleY2,
          axisYType: "secondary",
          color: "#9dce65",
          dataPoints: @columns
        }
      ]
    }
  end
end
