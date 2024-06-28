package eu.campesinux.hcProj.hcBE.core.helpers;

import java.io.IOException;
import java.time.LocalDate;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

public class NegativeDateSerializer extends StdSerializer<LocalDate> {
	
	protected NegativeDateSerializer(JavaType type) {
		super(type);
	}
	
	private static final long serialVersionUID = 1L;
	
	@Override
	public void serialize(LocalDate value, JsonGenerator gen, SerializerProvider provider) throws IOException {
		
		String serialized = "";
		if (value.getYear()<0) serialized = "-";
		
		serialized += value.getYear() + "-" + value.getMonthValue() + "-" + value.getDayOfMonth();
		
		gen.writeString(serialized);
	}
	
}
