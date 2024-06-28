package eu.campesinux.hcProj.hcBE.core.helpers;

public class CommonRegexes {
	
	public static final String DESCR_REGEX = "[a-zA-Z0-9\\s\\,\\'\\.]{5,255}";
	
	public static final String WIKI_REGEX = "https:\\/\\/([\\w]+)\\.wikipedia\\.org\\/wiki\\/([\\w%#_\\,\\-\\%\\(\\)]+)";
}
