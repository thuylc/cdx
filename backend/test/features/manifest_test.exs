defmodule ManifestTest do
  use Cdp.TestCase

  defp assert_manifest_application(mappings_json, data, expected) do
    manifest_json = """
                    {
                      "field_mapping" : #{mappings_json}
                    }
                    """
    manifest = JSEX.decode!(manifest_json)
    result = Manifest.apply(manifest, data)
    assert result == expected
  end

  defp assert_raises_manifest_data_validation(mappings_json, data, message) do
    manifest_json = """
                    {
                      "field_mapping" : #{mappings_json}
                    }
                    """
    manifest = JSEX.decode!(manifest_json)
    assert_raise RuntimeError, message, fn ->
      Manifest.apply(manifest, data)
    end
  end

  test "apply to indexed core field" do
    assert_manifest_application """
                    [{
                        "target_field": "assay_name",
                        "selector" : "assay/name",
                        "type" : "core"
                    }]
                    """,
                    %{"assay" => %{"name" => "GX4002"}},
                    %{indexed: %{"assay_name" => "GX4002"}, pii: %{}, custom: %{}}
  end

  test "apply to pii core field" do
    assert_manifest_application """
                    [{
                        "target_field": "patient_name",
                        "selector" : "patient/name",
                        "type" : "core"
                    }]
                    """,
                    %{"patient" => %{"name" => "John"}},
                    %{indexed: %{}, pii: %{"patient_name" => "John"}, custom: %{}}
  end

  test "apply to custom non-pii non-indexed field" do
    assert_manifest_application """
                    [{
                        "target_field": "temperature",
                        "selector" : "temperature",
                        "type" : "custom",
                        "pii": false,
                        "indexed": false
                    }]
                    """,
                    %{"temperature" => 20},
                    %{indexed: %{}, pii: %{}, custom: %{"temperature" => 20}}
  end

  test "apply to custom non-pii indexed field" do
    assert_manifest_application """
                    [{
                        "target_field": "temperature",
                        "selector" : "temperature",
                        "type" : "custom",
                        "pii": false,
                        "indexed": true
                    }]
                    """,
                    %{"temperature" => 20},
                    %{indexed: %{"temperature" => 20}, pii: %{}, custom: %{}}
  end

  test "doesn't raise on valid value in options" do
    assert_manifest_application """
                    [{
                        "target_field": "level",
                        "selector" : "level",
                        "type" : "custom",
                        "pii": false,
                        "indexed": true,
                        "valid_values": {
                          "options": ["low", "medium", "high"]
                        }
                    }]
                    """,
                    %{"level" => "high"},
                    %{indexed: %{"level" => "high"}, pii: %{}, custom: %{}}
  end

  test "raises on invalid value in options" do
    assert_raises_manifest_data_validation """
                    [{
                        "target_field": "level",
                        "selector" : "level",
                        "type" : "custom",
                        "pii": false,
                        "indexed": true,
                        "valid_values": {
                          "options": ["low", "medium", "high"]
                        }
                    }]
                    """,
                    %{"level" => "John Doe"},
                    "'John Doe' is not a valid value for 'level' (valid options are: low, medium, high)"
  end

  test "doesn't raise on valid value in range" do
    assert_manifest_application """
                    [{
                        "target_field": "temperature",
                        "selector" : "temperature",
                        "type" : "custom",
                        "pii": false,
                        "indexed": true,
                        "valid_values": {
                          "range": {
                            "min": 30,
                            "max": 30
                          }
                        }
                    }]
                    """,
                    %{"temperature" => 30},
                    %{indexed: %{"temperature" => 30}, pii: %{}, custom: %{}}
  end

  test "raise on invalid value in range (lesser)" do
    assert_raises_manifest_data_validation """
                    [{
                        "target_field": "temperature",
                        "selector" : "temperature",
                        "type" : "custom",
                        "pii": false,
                        "indexed": true,
                        "valid_values": {
                          "range": {
                            "min": 30,
                            "max": 31
                          }
                        }
                    }]
                    """,
                    %{"temperature" => 29.9},
                    "'29.9' is not a valid value for 'temperature' (valid values must be between 30 and 31)"
  end

  test "raise on invalid value in range (greater)" do
    assert_raises_manifest_data_validation """
                    [{
                        "target_field": "temperature",
                        "selector" : "temperature",
                        "type" : "custom",
                        "pii": false,
                        "indexed": true,
                        "valid_values": {
                          "range": {
                            "min": 30,
                            "max": 31
                          }
                        }
                    }]
                    """,
                    %{"temperature" => 31.1},
                    "'31.1' is not a valid value for 'temperature' (valid values must be between 30 and 31)"
  end
end
