module Poolsureth

  # TODO: make it a proper class

  def render(template, locals:)
    Tilt.new("#{PATH}/templates/#{template}.sol.erb").render Object.new, locals
  end

  def write(contents, name:)
    File.open("#{PATH}/contracts/#{name}_build.sol", "w") do |file|
      file.write contents
    end
  end


end
