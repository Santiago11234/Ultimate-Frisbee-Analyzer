"use client"
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ShotAnalyzer = () => {
  const [fieldPosition, setFieldPosition] = useState({ x: 0, y: 0 });
  const [historicalShots, setHistoricalShots] = useState([]);
  const [prediction, setPrediction] = useState(null);
  
  // Field dimensions in yards (AUDL field)
  const FIELD_WIDTH = 53.3;
  const FIELD_LENGTH = 80;
  
  // SVG viewport dimensions
  const SVG_WIDTH = 400;
  const SVG_HEIGHT = 300;
  
  // Simplified logistic regression coefficients
  const COEFFICIENTS = {
    intercept: 0.8,
    distance: -0.03,
    centrality: 0.02
  };

  const calculateShotProbability = (x, y) => {
    const distance = FIELD_LENGTH - y;
    const centrality = 1 - (Math.abs(x) / (FIELD_WIDTH / 2));
    
    const z = COEFFICIENTS.intercept + 
              (COEFFICIENTS.distance * distance) + 
              (COEFFICIENTS.centrality * centrality);
    
    const probability = 1 / (1 + Math.exp(-z));
    return Math.max(0, Math.min(1, probability));
  };

  const predictShot = (x, y) => {
    const probability = calculateShotProbability(x, y);
    setPrediction(probability);
    
    setHistoricalShots(prev => [...prev, {
      x,
      y,
      probability
    }]);
  };

  // Convert field coordinates to SVG coordinates
  const fieldToSVG = (x, y) => ({
    x: ((x + FIELD_WIDTH/2) / FIELD_WIDTH) * SVG_WIDTH,
    y: SVG_HEIGHT - ((y / FIELD_LENGTH) * SVG_HEIGHT)
  });

  // Convert SVG coordinates to field coordinates
  const SVGToField = (svgX, svgY) => ({
    x: (svgX / SVG_WIDTH * FIELD_WIDTH) - (FIELD_WIDTH/2),
    y: (1 - svgY / SVG_HEIGHT) * FIELD_LENGTH
  });

  const handleSVGClick = (e) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const fieldCoords = SVGToField(x, y);
    setFieldPosition(fieldCoords);
    predictShot(fieldCoords.x, fieldCoords.y);
  };

  const renderField = () => {
    return (
      <div className="mt-4">
        <svg 
          width={SVG_WIDTH} 
          height={SVG_HEIGHT} 
          className="w-full border-2 border-green-500"
          onClick={handleSVGClick}
          style={{ backgroundColor: '#e5f5e5' }}
        >
          {/* Field markings */}
          <line 
            x1={SVG_WIDTH/2} 
            y1="0" 
            x2={SVG_WIDTH/2} 
            y2={SVG_HEIGHT} 
            stroke="white" 
            strokeWidth="1" 
            opacity="0.5" 
          />
          <line 
            x1="0" 
            y1={SVG_HEIGHT} 
            x2={SVG_WIDTH} 
            y2={SVG_HEIGHT} 
            stroke="white" 
            strokeWidth="2" 
          />
          <line 
            x1="0" 
            y1="0" 
            x2={SVG_WIDTH} 
            y2="0" 
            stroke="white" 
            strokeWidth="2" 
          />
          
          {/* Historical shots */}
          {historicalShots.map((shot, i) => {
            const svgCoords = fieldToSVG(shot.x, shot.y);
            return (
              <circle
                key={i}
                cx={svgCoords.x}
                cy={svgCoords.y}
                r="4"
                fill={`rgba(255, ${Math.floor(shot.probability * 255)}, 0, 0.7)`}
              />
            );
          })}
          
          {/* Current position marker */}
          {fieldPosition && (
            <circle
              cx={fieldToSVG(fieldPosition.x, fieldPosition.y).x}
              cy={fieldToSVG(fieldPosition.x, fieldPosition.y).y}
              r="6"
              fill="blue"
            />
          )}
          
          {/* Probability heatmap (simplified) */}
          <g opacity="0.2">
            {Array.from({ length: 20 }, (_, i) => 
              Array.from({ length: 20 }, (_, j) => {
                const x = (j/20) * FIELD_WIDTH - FIELD_WIDTH/2;
                const y = (1 - i/20) * FIELD_LENGTH;
                const prob = calculateShotProbability(x, y);
                const svgCoords = fieldToSVG(x, y);
                return (
                  <rect
                    key={`${i}-${j}`}
                    x={svgCoords.x - SVG_WIDTH/40}
                    y={svgCoords.y - SVG_HEIGHT/20}
                    width={SVG_WIDTH/20}
                    height={SVG_HEIGHT/20}
                    fill={`rgba(0, 0, 255, ${prob * 0.3})`}
                  />
                );
              })
            )}
          </g>
        </svg>
      </div>
    );
  };

  const renderProbabilityGauge = () => {
    if (prediction === null) return null;
    
    const gaugeWidth = 200;
    const gaugeHeight = 20;
    
    return (
      <div className="mt-4">
        <svg width={gaugeWidth} height={gaugeHeight}>
          {/* Background */}
          <rect
            width={gaugeWidth}
            height={gaugeHeight}
            fill="#eee"
            rx="4"
          />
          {/* Probability bar */}
          <rect
            width={gaugeWidth * prediction}
            height={gaugeHeight}
            fill="#4CAF50"
            rx="4"
          />
          {/* Percentage text */}
          <text
            x={gaugeWidth/2}
            y={gaugeHeight/2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="black"
            fontSize="12"
          >
            {(prediction * 100).toFixed(1)}%
          </text>
        </svg>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Ultimate Frisbee Shot Analyzer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Click anywhere on the field to analyze shot probability. The model considers:
            <br />
            • Distance from the endzone
            <br />
            • Position relative to the center of the field
          </p>
          {renderField()}
          {prediction !== null && (
            <Alert>
              <AlertDescription>
                Shot success probability: {(prediction * 100).toFixed(1)}%
                <br />
                Position: ({fieldPosition.x.toFixed(1)}, {fieldPosition.y.toFixed(1)}) yards
                {renderProbabilityGauge()}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShotAnalyzer;