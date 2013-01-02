module ApplicationHelper
	def asset_url(source)
		return "#{request.protocol}#{request.host_with_port}#{asset_path(source)}"
	end
	
	def yield_or(name, content = nil, &block)
		if content_for?(name)
			content_for(name)
		else
			block_given? ? capture(&block) : content
		end
	end
end
