package main

import (
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"time"
)

//Check OpenShift/Kubernetes configuration files for probable errors and omissions
//Supports command line, server and GUI use
func main() {
	flag.Usage = func() {
		fmt.Fprintf(os.Stderr, "Usage: ./%s [<JSON/YAML file> [<JSON/YAML file>]]\n", filepath.Base(os.Args[0]))
		flag.PrintDefaults()
		fmt.Fprintf(os.Stderr, "Commands:\n  list\tPrint list of available checks\n")
		os.Exit(0)
	}

	host := flag.String("n", "localhost", "hostname")
	port := flag.Int("p", 8000, "listen on port")
	output := flag.String("o", "md", "output format (json, yaml or md)")
	namespaceLabel := flag.String("namespace-label", "env", "metadata.labels key denoting namespace")
	namespacePattern := flag.String("namespace", "^[a-z0-9_-]*$", "pattern for namespaces/projects")
	namePattern := flag.String("name", "^[a-z0-9_-]+$", "pattern for names")
	containerPattern := flag.String("container", "^[a-z0-9_-]+$", "pattern for containers")
	envPattern := flag.String("env", "^[A-Z0-9_-]+$", "pattern for environment variables")

	flag.Parse()
	args := flag.Args()

	//patterns are ignored in server mode - specify as follows:
	//{ customNamespacePattern="...", customNamePattern="..."", ... }
	if len(args) == 0 {
		serve(*host, *port)
		return
	} else if len(args) == 1 {
		switch args[0] {
		case "list":
			ListLinterItems()
			os.Exit(0)
		default:
			break
		}
	}

	for _, arg := range args {
		start := time.Now()
		buffer, err := processFile(arg, LinterParams{*namespaceLabel, *namespacePattern, *namePattern, *containerPattern, *envPattern, *output})
		secs := time.Since(start).Seconds()

		if err != nil {
			fmt.Fprintf(os.Stderr, "%s: %v (%.2fs)\n", arg, err, secs)
			return
		}
		fmt.Println(buffer)
	}
}
