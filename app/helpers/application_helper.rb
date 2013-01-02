module ApplicationHelper
	def asset_url(source)
		return "#{request.protocol}#{request.host_with_port}#{asset_path(source)}"
	end
end
